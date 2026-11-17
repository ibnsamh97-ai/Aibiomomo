import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_IRAQI_SCRIPT,
  PLANT_DRAMA_SCENES,
  countArabicWords,
  estimateSpeechDurationSeconds,
  formatDuration,
  validateScriptInput,
  buildIraqiVoiceStylePrompt,
  splitScriptForDualCast,
  parseWavMetadata,
} from './iraqiScript';

test('DEFAULT_IRAQI_SCRIPT contains key Bioverse and plant tissue terms', () => {
  assert.ok(DEFAULT_IRAQI_SCRIPT.includes('النسيج الأساس'));
  assert.ok(DEFAULT_IRAQI_SCRIPT.includes('الخلايا الصخرية'));
  assert.ok(DEFAULT_IRAQI_SCRIPT.includes('بايوڤيرس'));
  assert.equal(PLANT_DRAMA_SCENES.length, 4);
});

test('countArabicWords counts words accurately across multi-line text', () => {
  assert.equal(countArabicWords(''), 0);
  assert.equal(countArabicWords('   \n  '), 0);
  assert.equal(countArabicWords('خلي نتخيل عالم النبات'), 4);
  assert.ok(countArabicWords(DEFAULT_IRAQI_SCRIPT) > 90);
});

test('estimateSpeechDurationSeconds and formatDuration compute valid MM:SS strings', () => {
  assert.equal(estimateSpeechDurationSeconds(''), 0);
  const est = estimateSpeechDurationSeconds(DEFAULT_IRAQI_SCRIPT);
  assert.ok(est >= 40 && est <= 80);
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(-5), '00:00');
});

test('validateScriptInput rejects empty, short, and oversized inputs', () => {
  assert.equal(validateScriptInput('   ').valid, false);
  assert.equal(validateScriptInput('أه').valid, false);
  assert.equal(validateScriptInput('أ'.repeat(4501)).valid, false);
  assert.equal(validateScriptInput(DEFAULT_IRAQI_SCRIPT).valid, true);
});

test('buildIraqiVoiceStylePrompt includes Baghdadi Iraqi direction and optional custom note', () => {
  const base = buildIraqiVoiceStylePrompt('turkish_drama');
  assert.ok(base.includes('Baghdadi Iraqi'));
  const custom = buildIraqiVoiceStylePrompt('bioverse_reel', 'تأكيد على كلمة بايوڤيرس');
  assert.ok(custom.includes('تأكيد على كلمة بايوڤيرس'));
});

test('splitScriptForDualCast alternates speakers cleanly', () => {
  const turns = splitScriptForDualCast('السطر الأول\nالسطر الثاني\nالسطر الثالث\nالسطر الرابع');
  assert.equal(turns.length, 2);
  assert.equal(turns[0].speaker, 'الراوي');
  assert.equal(turns[1].speaker, 'المعلق');
  assert.ok(turns[0].text.includes('السطر الأول'));
  assert.ok(turns[1].text.includes('السطر الثالث'));
});

test('parseWavMetadata parses valid 24kHz mono 16-bit WAV headers', () => {
  const pcmBytes = 48000; // 1 second at 24kHz * 1ch * 2bytes
  const buffer = Buffer.alloc(44 + pcmBytes);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + pcmBytes, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(24000, 24);
  buffer.writeUInt32LE(48000, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(pcmBytes, 40);

  const meta = parseWavMetadata(buffer.toString('base64'));
  assert.ok(meta !== null);
  assert.equal(meta.sampleRate, 24000);
  assert.equal(meta.channels, 1);
  assert.equal(meta.bitsPerSample, 16);
  assert.equal(Math.round(meta.durationSeconds), 1);
  assert.equal(parseWavMetadata('not-valid-wav'), null);
});
