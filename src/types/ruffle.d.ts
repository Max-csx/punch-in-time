declare module '@ruffle-rs/ruffle' {
  interface RufflePlayer extends Element {
    style: Record<string, string>;
    remove: () => void;
    load: (url: string) => Promise<void>;
    play: () => void;
    destroy: () => void;
  }

  interface RuffleStatic {
    newest: () => { createPlayer: () => RufflePlayer };
  }

  const Ruffle: RuffleStatic;
  export default Ruffle;
}
