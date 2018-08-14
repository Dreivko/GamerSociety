export class Message {
    constructor(
        public _id: string,
        public emisor: string,
        public receptor: string,
        public texto: string,
        public creado_el: string
    ) { }
}