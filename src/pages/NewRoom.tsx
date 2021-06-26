import { Link, useHistory } from 'react-router-dom'

import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import illustrationDarkImg from '../assets/images/illustration-dark.svg'
import logoImg from '../assets/images/logo.svg'
import logoDarkImg from '../assets/images/logo-dark.svg'
import darklightImg from '../assets/images/dark-theme.png'

import { Button } from '../components/Button/index';
// import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');
  const { theme, toggleTheme } = useTheme();

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside className={theme}>
        {theme === 'dark' ? (
          <img src={illustrationDarkImg} alt="Ilustração simbolizando perguntas e respostas" />
        ) : (
          <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        )}
        <strong>Toda pergunta tem <br /> uma resposta.</strong>
        <p className={theme}>Aprenda, compartilhe e tire as dúvidas <br /> da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <div>
              {theme === 'dark' ? (
                <img src={logoDarkImg} alt="Letmeask" />
              ) : (
                <img src={logoImg} alt="Letmeask" />
              )}
              
              <img src={darklightImg} alt="Mude o tema para sua preferência" onClick={toggleTheme} />
            </div>
          <img className="user-photo" src={user?.avatar} alt={user?.name} />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
             type="text"
             placeholder="Nome da sala"
             onChange={event => setNewRoom(event.target.value)}
             value={newRoom}
             />
             <Button type="submit">
               Criar sala
             </Button>
          </form>
          <p>
            Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}