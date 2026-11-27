#!/usr/bin/env python3
"""SoulSync — tools/add-breath.py

Puts one calm breath inside a recorded prayer, at a measured syllable
boundary: the held word gets a soft cosine tail instead of a cut, then a
clean pause, then the next word comes back in.

    python3 tools/add-breath.py             # both voices
    python3 tools/add-breath.py male        # only the male recording
    python3 tools/add-breath.py --dry-run   # measure, write nothing

The recording is decoded to PCM at its own sample rate, edited, and encoded
again at 64 kb/s mono (the bitrate the other hand-tuned prayers use). Nothing
else in the file changes, so the voice, tone and level stay as they are.

Fatima (구원의 기도) — the user asked for "오~ 한템포 쉬고, 예수님~":
the prayer opens on a short "오," and the following "예수님," starts 0.54 s
later, with the gap full of the encoder's low hiss instead of quiet. The tool
lets the "오" settle, holds a real 0.65 s of silence, and brings "예수님" back
in softly.
"""
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

PAUSE = 0.65        # seconds of silence at the breath
TAIL = 0.11         # cosine fade-out length before the silence
LEAD = 0.02         # cosine fade-in length on the returning word
EDGE_DB = -46.0     # a 1 ms frame above this is speech, below is the hiss
BITRATE = "64k"

# file -> (search window start, search window end) around the breath
BREATHS = {
    "audio/ko-male/fatima.mp3": (0.30, 1.30),
    "audio/ko-female/fatima.mp3": (0.20, 1.30),
}


def ffmpeg():
    exe = os.environ.get("FFMPEG")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:  # noqa: BLE001 - fall back to PATH
        return "ffmpeg"


def decode(path):
    ff = ffmpeg()
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "in.wav")
        subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-i", path,
                        "-ac", "1", "-f", "wav", wav], check=True)
        with wave.open(wav) as fh:
            sr = fh.getframerate()
            data = np.frombuffer(fh.readframes(fh.getnframes()), dtype=np.int16)
    return data.astype(np.float32) / 32768.0, sr


def encode(pcm, sr, path):
    ff = ffmpeg()
    raw = (np.clip(pcm, -1.0, 1.0) * 32767.0).astype(np.int16).tobytes()
    with tempfile.TemporaryDirectory() as tmp:
        p = os.path.join(tmp, "out.pcm")
        with open(p, "wb") as fh:
            fh.write(raw)
        subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", p,
                        "-c:a", "libmp3lame", "-b:a", BITRATE,
                        "-write_xing", "1", "-id3v2_version", "0", path], check=True)


def envelope(pcm, sr, ms=1.0):
    hop = max(1, int(sr * ms / 1000))
    n = len(pcm) // hop
    rms = np.sqrt((pcm[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    return 20 * np.log10(np.maximum(rms, 1e-9)), hop


def find_breath(pcm, sr, start, end, edge_db=EDGE_DB):
    """Last speech sample before the gap and first speech sample after it."""
    db, hop = envelope(pcm, sr)
    lo, hi = int(start * sr / hop), min(len(db), int(end * sr / hop))
    loud = np.where(db[lo:hi] > edge_db)[0] + lo
    if len(loud) < 2:
        raise SystemExit("no speech found in %.2f-%.2f s" % (start, end))
    # the gap is the longest run of quiet frames inside the window
    runs, run_start = [], None
    for i in range(lo, hi):
        quiet = db[i] <= edge_db
        if quiet and run_start is None:
            run_start = i
        elif not quiet and run_start is not None:
            runs.append((run_start, i))
            run_start = None
    if run_start is not None:
        runs.append((run_start, hi))
    if not runs:
        raise SystemExit("no gap in %.2f-%.2f s" % (start, end))
    gap_start, gap_end = max(runs, key=lambda r: r[1] - r[0])
    return gap_start * hop, gap_end * hop, gap_start * hop / sr, gap_end * hop / sr


def build(pcm, sr, cut_end, back, pause=PAUSE, tail=TAIL, lead=LEAD):
    """Silence cut_end..back, with a soft tail before and a soft return after."""
    tail_n = int(tail * sr)
    lead_n = int(lead * sr)
    before = pcm[:cut_end].copy()
    # cosine fade-out on the held syllable
    lo = max(0, cut_end - tail_n)
    ramp = 0.5 * (1.0 + np.cos(np.linspace(0.0, np.pi, cut_end - lo)))
    before[lo:cut_end] *= ramp
    # and make sure the very last sample is at rest
    before[cut_end - 3:cut_end] = 0.0

    after = pcm[back:].copy()
    hi = min(lead_n, len(after))
    ramp_in = 0.5 * (1.0 - np.cos(np.linspace(0.0, np.pi, hi)))
    after[:hi] *= ramp_in

    silence = np.zeros(int(round(pause * sr)), dtype=np.float32)
    return np.concatenate([before, silence, after])


def rms_db(pcm):
    return 20 * np.log10(max(float(np.sqrt((pcm ** 2).mean())), 1e-9))


def level_ratio(old, new, sr, at=5.0, span=1.0):
    """How much quieter or louder the encoded body is, by correlation."""
    a = old[int(at * sr):int((at + span) * sr)]
    b = new[int(at * sr):int((at + span) * sr)]
    n = min(len(a), len(b))
    a, b = a[:n], b[:n]
    best, lag = -1.0, 0
    for cand in range(-600, 601, 4):
        lo, hi = 400, n - 1600
        if lo + cand < 0 or hi + cand > n:
            continue
        c = float(np.dot(a[lo:hi], b[lo + cand:hi + cand]))
        if c > best:
            best, lag = c, cand
    a = a[400: n - 1200]
    b = b[400 + lag: n - 1200 + lag]
    return float(np.sqrt((b ** 2).sum() / max((a ** 2).sum(), 1e-12)))


def main(argv):
    dry = "--dry-run" in argv
    wanted = [a for a in argv if not a.startswith("--")]
    gender = wanted[0] if wanted else "all"
    only = ["male", "female"] if gender == "all" else [gender]
    for g in only:
        rel = "audio/ko-%s/fatima.mp3" % g
        start, end = BREATHS[rel]
        path = os.path.join(ROOT, rel)
        pcm, sr = decode(path)
        cut, back, cut_s, back_s = find_breath(pcm, sr, start, end)
        print("%-24s %.3fs  speech %.2f-%.2fs  gap %.3fs (%.2f-%.2fs)"
              % (rel, len(pcm) / sr, 0, cut_s, (back - cut) / sr, cut_s, back_s))
        if dry:
            print("   would hold %.2fs of silence after the syllable" % PAUSE)
            continue
        out = build(pcm, sr, cut, back)
        encode(out, sr, path)
        # the encoder lands a touch under the source: measure and match it
        new, sr2 = decode(path)
        for _ in range(2):
            ratio = level_ratio(pcm, new, sr2)
            gain_db = 20 * np.log10(ratio)
            if abs(gain_db) < 0.05:
                break
            out = out * (1.0 / ratio) if ratio > 0 else out
            if abs(out).max() > 0.999:
                out = out / abs(out).max() * 0.999
            encode(out, sr, path)
            new, sr2 = decode(path)
        ncut, nback, ncut_s, nback_s = find_breath(new, sr2, cut_s - 0.1, back_s + 0.7)
        print("   wrote %.2fs (+%.2fs)  pause %.3fs (%.2f-%.2fs)  level %+.2f dB vs source"
              % (len(new) / sr2, (len(new) - len(pcm)) / sr,
                 (nback - ncut) / sr2, ncut_s, nback_s,
                 20 * np.log10(level_ratio(pcm, new, sr2))))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
