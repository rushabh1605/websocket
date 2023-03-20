import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import './App.css';


function App() {
/*   ;
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')
  const [chat, setChat] = useState([]); */
  const [state, setState] = useState({message: '', userName: ''})
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [chat, setChat] = useState([]);
  //const [message, setMessage] = useState('');
  //const [messages, setMessages] = useState([]);
  //const [users, setUsers] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({userName, message}) => {
      console.log('The server has sent some data to all clients');
      setChat(chat => [...chat, {userName, message}]);
    });
    socketRef.current.on('user_join', ({userName, users}) => {
      setUsers(users)
      setChat(chat => [
        ...chat,
        {name: 'ChatBot', message: `${userName} has joined the chatroom`}
      ]);
    });

    socketRef.current.on('user_left', ({ userName, users }) => {
      setUsers(users);
      setChat(chat => [...chat, { name: 'ChatBot', message: `${userName} left the chatroom` }]);
    });


    return () => {
      socketRef.current.off('message');
      socketRef.current.off('user_join');
      socketRef.current.off('user_left')
    };
  }, [chat]);

/*   const userjoin = (name) => {
    socketRef.current.emit('user_join', name);
  }; */

  const userjoin = e => {
    e.preventDefault();
    socketRef.current.emit('user_leave', { roomName, userName });
    socketRef.current.emit('user_join', { roomName, userName });
  };

  const userleave = () => {
    socketRef.emit('leave', { roomName, userName });
    setMessages([]);
    setUsers([]);
  };
  
  const handleMessage = e => {
    e.preventDefault();
    socketRef.emit('message', { roomName, userName, message });
    setMessage('');
  };


   const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    console.log([msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value
    });
    e.preventDefault();
    setState({message: '', name: state.name});
    msgEle.value = '';
    msgEle.focus();
  }; 

   const renderChat = () => {
    console.log('In render chat');
    return chat.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };


/*
  return (
    <div>
      {state.name && (
        <div className='card'>
          <div className='render-chat'>
            <h1>Chat Log</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name='message'
                id='message'
                variant='outlined'
                label='Message'
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className='form'
          onSubmit={(e) => {
            console.log(document.getElementById('username_input').value);
            e.preventDefault();
            setState({name: document.getElementById('username_input').value});
            userjoin(document.getElementById('username_input').value);
            // userName.value = '';
          }}
        >
          <div className='form-group'>
            <label>
              User Name:
              <br />
              <input id='username_input' />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type='submit'> Click to join</button>
        </form>
      )}
    </div>
  );
} */

return (
  <div>
    {roomName && userName ? (
      <>
        <div>
          <h2>{roomName} Chat Room</h2>
          <p>Users: {users.join(', ')}</p>
          <button onClick={handleLeave}>Leave Room</button>
        </div>
        <div>
          {messages.map(({ userName, message }, index) => (
            <div key={index}>
              <strong>{userName}: </strong>
              <span>{message}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleMessage}>
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </>
    ) : (
      <form className='form' onSubmit={(e) => {
        console.log(document.getElementById('username_input').value);
        e.preventDefault();
        setState({userName: document.getElementById('username_input').value});
        setRoomName(document.getElementById('room_input').value)
        userjoin(document.getElementById('username_input').value, );
        setUserName(document.getElementById('username_input').value)
        // userName.value = '';
      }}>

        <div className='form-group'>
          <label>Room Name: <br/> <input id='room_input'/></label>
          <label>User Name: <br /> <input id='username_input'/></label>
          </div>
          <br />
          <br />
          <br />
          <button type='submit'> Click to join</button>
      </form>

    )}
  </div>
);
}


export default App;
