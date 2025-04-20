interface RTCIceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

class PeerService {
  private peer: RTCPeerConnection | null = null;

  constructor() {
    this.initializePeerConnection();
  }

  private initializePeerConnection(): void {
    if (!this.peer) {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ];

      this.peer = new RTCPeerConnection({iceServers});

      // Добавляем обработчики событий для отладки
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
        }
      };

      this.peer.onconnectionstatechange = () => {
        console.log('Connection state changed:', this.peer?.connectionState);
      };
    }
  }

  async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
    try {
      if (!this.peer) {
        throw new Error('PeerConnection is not initialized');
      }

      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('Error in getAnswer:', error);
      throw error;
    }
  }

  async setLocalDescription(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      if (!this.peer) {
        throw new Error('PeerConnection is not initialized');
      }

      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error in setLocalDescription:', error);
      throw error;
    }
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    try {
      if (!this.peer) {
        throw new Error('PeerConnection is not initialized');
      }

      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error in getOffer:', error);
      throw error;
    }
  }

  closeConnection(): void {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
  }

  get connectionState(): RTCPeerConnectionState | undefined {
    return this.peer?.connectionState;
  }
}

const peerService = new PeerService();
export default peerService;