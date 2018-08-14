export class Publication {
    constructor(
        public _id: string,
        public usuario: string,
        public texto: string,
        public archivo: string,
        public creado_el: string,
    ) { }
}