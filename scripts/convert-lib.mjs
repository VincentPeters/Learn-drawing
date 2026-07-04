// Pure helpers for the one-off legacy-data → content-collection conversion.

export function htmlToMd(s) {
  return s
    .replace(/<b>(.*?)<\/b>/g, '**$1**')
    .replace(/<i>(.*?)<\/i>/g, '*$1*');
}

// JSON string escaping is valid YAML — safe for quotes, unicode, colons.
const yamlStr = (s) => JSON.stringify(s);

export function lessonMd(module, d) {
  return [
    '---',
    `module: ${module}`,
    `number: ${d.n}`,
    `phase: ${d.phase}`,
    `title: ${yamlStr(d.title)}`,
    `diagram: ${yamlStr(d.diagram)}`,
    `objective: ${yamlStr(htmlToMd(d.objective))}`,
    'warmup:',
    ...d.warmup.map((w) => `  - ${yamlStr(htmlToMd(w))}`),
    'main:',
    ...d.main.map((w) => `  - ${yamlStr(htmlToMd(w))}`),
    `checkpoint: ${yamlStr(htmlToMd(d.checkpoint))}`,
    '---',
    '',
    htmlToMd(d.tip),
    '',
  ].join('\n');
}

export function phaseEntry(module, index, p) {
  return {
    id: `m${module}-p${index}`,
    module,
    index,
    name: p.name,
    color: p.color,
    blurb: p.blurb,
    lessons: p.days,
  };
}
