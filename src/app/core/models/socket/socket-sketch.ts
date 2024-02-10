import { DrawModes } from "../../../pages/sketch-page/sketch-page.component";

export interface SocketSketch {
    data?: any;
    drawMode: DrawModes;
    roomUuid?: string;
    senderId?: string;
}