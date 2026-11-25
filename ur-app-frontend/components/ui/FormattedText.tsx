interface FormattedTextProps {
  text: string;
}

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // Check for unordered list: starts with -, *, or •
    if (/^[-*•]\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*•]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 my-2 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Check for ordered list: starts with number.
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-6 my-2 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(<p key={`p-${i}`} className="my-3">{trimmed}</p>);
    i++;
  }

  return <div className="prose max-w-none">{elements}</div>;
}