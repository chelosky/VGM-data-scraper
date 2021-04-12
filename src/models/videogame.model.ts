import { Ost } from './ost.model';
export interface Videogame{
    name?: string;
    description?: string;
    saga?: string;
    image?: string;
    url?: string;
    osts?: Ost[];
}