
interface Props {
    value: string;
    onChange: (value: string) => void;
    width?: string;

}

export default function SearchBox({ value, onChange, width }: Props) {
    return (
        <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search projects by name..."
            style= {{
                width: width,
                height: "36px",
                backgroundColor: "var(--background-100)",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "none"
            }}
        />
    );
}

