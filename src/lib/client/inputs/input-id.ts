export function inputId(id: string | undefined | null, name: string) {
	return id ?? (name ? `input-id-${name}` : `input-id-${Math.random().toString(36).slice(2)}`);
}
