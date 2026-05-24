interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (desc: string) => void;
}

export function DescriptionInput({ description, onDescriptionChange }: DescriptionInputProps) {
  return (
    <div>
      <div className="section-label">描述</div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="描述你想生成的素材..."
        className="input-field resize-none"
        rows={3}
      />
    </div>
  );
}
