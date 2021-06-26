import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import logoDarkImg from '../assets/images/logo-dark.svg'
import darklightImg from '../assets/images/dark-theme.png'
import chatImg from '../assets/images/chat.svg'

import { Button } from '../components/Button/index';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode/index';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
//  const { user } = useAuth();
  const history = useHistory();

  const { theme, toggleTheme } = useTheme();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room" className={theme}>
      <header className={theme}>
        <div className="content">
        <div>
              {theme === 'dark' ? (
                <img src={logoDarkImg} alt="Letmeask" />
              ) : (
                <img src={logoImg} alt="Letmeask" />
              )}
              
              <img src={darklightImg} alt="Mude o tema para sua preferência" onClick={toggleTheme} />
            </div>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1 className={theme}>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        {questions.length === 0 ? (
          <div className="empty-questions-room">
            <img src={chatImg} alt="Nenhuma pergunta por aqui..." />
            <h2>Nenhuma pergunta por aqui...</h2>
            <p>Envie o código desta sala para seus amigos e <br /> comece a responder perguntas!</p>
          </div>
        ) : (
          <div className="question-list">
          {questions.map(question => {
            return (
              <Question
              key={question.id} 
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
        )}
      </main>
    </div>
  );
}