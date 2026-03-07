export function getLiveStreamsAlwaysOn(): boolean {
    return false;
}

export function subscribeLiveStreamsSettingsChange(_cb: (alwaysOn: boolean) => void): () => void {
    return () => { };
}
