import { Server, Socket } from "socket.io";
import type { AnswerData, CallData, NegotiationData, RoomJoinData } from "../types/webrtc.interface";

export const io = new Server(5000, {
  cors: {
    origin: "*", // Укажите конкретные домены для production
    methods: ["GET", "POST"]
  }
});

const emailToSocketIdMap = new Map<string, string>();
const socketidToEmailMap = new Map<string, string>();

export class WebRTCService {
    static runRtcServer = () => {
        io.on("connection", (socket: Socket) => {
            socket.on("room:join", (data: RoomJoinData) => {
                const { email, room } = data;
                emailToSocketIdMap.set(email, socket.id);
                socketidToEmailMap.set(socket.id, email);
                
                io.to(room).emit("user:joined", { email, id: socket.id });
                socket.join(room);
                io.to(socket.id).emit("room:join", data);
            });
          
            socket.on("user:call", ({ to, offer }: CallData) => {
                io.to(to).emit("incoming:call", { from: socket.id, offer });
            });
          
            socket.on("call:accepted", ({ to, ans }: AnswerData) => {
                io.to(to).emit("call:accepted", { from: socket.id, ans });
            });
          
            socket.on("peer:nego:needed", ({ to, offer }: NegotiationData) => {
                io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
            });
          
            socket.on("peer:nego:done", ({ to, ans }: NegotiationData) => {
                io.to(to).emit("peer:nego:final", { from: socket.id, ans });
            });
          
            socket.on("disconnect", () => {
                const email = socketidToEmailMap.get(socket.id);
                if (email) {
                    emailToSocketIdMap.delete(email);
                    socketidToEmailMap.delete(socket.id);
                }
            });
        });
    }
}
