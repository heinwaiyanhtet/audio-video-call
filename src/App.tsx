import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  StreamVideo,
  StreamCall,
  StreamTheme,
  ParticipantView,
  StreamVideoClient,
  useCallStateHooks,
  CallingState,
} from '@stream-io/video-react-sdk';

// Updated Constants
const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0FuYWtpbl9Tb2xvIiwidXNlcl9pZCI6IkFuYWtpbl9Tb2xvIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDMwODg4NTYsImV4cCI6MTc0MzY5MzY1Nn0.m3fOYXOmPnnxPp3l9-dOD-scl0fpFGfmnzRx7W5yb9Y';
const userId = 'Anakin_Solo';
const callId = '6zClVdBwcjIV';

// Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Router>
  );
}

// Join Screen Component
const Join = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/call');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Join a Call</h2>
      <p>
        This is a hardcoded setup. Click "Join Call" to directly enter the call with pre-configured details.
      </p>
      <button
        onClick={handleJoin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Join Call
      </button>
    </div>
  );
};

// Call Screen Component
const Call = () => {
  const client = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: 'Oliver',
      image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
    },
    token,
  });

  const call = client.call('default', callId);

  call.join().catch((err) => console.error('Error joining call:', err));

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI />
      </StreamCall>
    </StreamVideo>
  );
};

// Call UI Component
const CallUI = () => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Connecting...</div>;
  }

  return (
    <StreamTheme>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
        {remoteParticipants.map((participant) => (
          <ParticipantView
            key={participant.sessionId}
            participant={participant}
            muteAudio={false}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            muteAudio={false}
          />
        )}
      </div>
    </StreamTheme>
  );
};
