import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { PLACEHOLDERS } from "../Components/OptimizedImage";

declare global {
  interface Window {
    google: any;
  }
}

interface ButtonGoogleAuthState {
  name: string | null;
  email: string | null;
  picture: string | null;
  isLoading: boolean;
  loadError: string | null;
}

class ButtonGoogleAuth extends React.Component<{}, ButtonGoogleAuthState> {
  private clientId: string;

  constructor(props: {}) {
    super(props);
    this.clientId = process.env.REACT_APP_CLIENT_ID_GOOGLE || '216829497725-tnolt3svi88k89g6kg07a1sau03kiha1.apps.googleusercontent.com';
  }

  state: ButtonGoogleAuthState = {
    name: null,
    email: null,
    picture: null,
    isLoading: false,
    loadError: null
  };

  componentDidMount() {
    this.loadGoogleScript();
  }

  componentDidUpdate(prevProps: {}, prevState: ButtonGoogleAuthState) {
    // Рендерим кнопку Google после загрузки API и когда пользователь не вошел
    if (!prevState.name && !this.state.name && window.google?.accounts) {
      setTimeout(() => this.renderGoogleButton(), 100);
    }
  }

  loadGoogleScript = () => {
    if (window.google?.accounts) {
      this.initializeGoogle();
      return;
    }

    // Загружаем скрипт, если его нет
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.initializeGoogle();
    };

    script.onerror = () => {
      this.setState({
        loadError: 'Не удалось загрузить Google API',
        isLoading: false
      });
    };

    document.body.appendChild(script);
  };

  initializeGoogle = () => {
    if (!window.google?.accounts) {
      this.setState({ loadError: 'Google API не доступен' });
      return;
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      ux_mode: 'popup',
    });

    this.setState({ isLoading: false, loadError: null });

    // Рендерим кнопку после инициализации
    setTimeout(() => this.renderGoogleButton(), 100);
  };

  renderGoogleButton = () => {
    const buttonContainer = document.getElementById('googleSignInButton');
    if (buttonContainer && window.google?.accounts) {
      // Очищаем контейнер перед рендерингом
      buttonContainer.innerHTML = '';

      window.google.accounts.id.renderButton(
        buttonContainer,
        {
          theme: 'outline',
          size: 'large',
          width: 250,
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left'
        }
      );
    }
  };

  handleCredentialResponse = (response: any) => {
    try {
      // Декодируем JWT токен
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      this.setState({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isLoading: false
      });
    } catch (error) {
      this.setState({
        loadError: 'Ошибка обработки ответа',
        isLoading: false
      });
    }
  };

  signIn = () => {
    if (!window.google?.accounts) {
      this.setState({ loadError: "Google API не загружен" });
      return;
    }

    this.setState({ isLoading: true, loadError: null });

    try {
      // Пытаемся показать One Tap UI
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          this.setState({ isLoading: false });
          this.renderGoogleButton();
        }
        if (notification.isSkippedMoment()) {
          this.setState({ isLoading: false });
          this.renderGoogleButton();
        }
        if (notification.isDismissedMoment()) {
          this.setState({ isLoading: false });
          this.renderGoogleButton();
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        loadError: 'Ошибка при открытии окна авторизации'
      });
      this.renderGoogleButton();
    }
  };

  signOut = () => {
    if (!window.google?.accounts) return;

    this.setState({ isLoading: true });

    try {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.revoke(this.clientId, () => {
        this.setState({
          name: null,
          email: null,
          picture: null,
          isLoading: false
        });
        // Снова рендерим кнопку после выхода
        setTimeout(() => this.renderGoogleButton(), 100);
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { name, email, picture, isLoading, loadError } = this.state;

    if (loadError) {
      return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ color: '#FF6B6B', marginBottom: '10px', fontSize: '14px' }}>
            ❌ {loadError}
          </div>
          <Button
            color="secondary"
            onClick={this.loadGoogleScript}
            style={{ width: '100%' }}
          >
            Попробовать снова
          </Button>
        </div>
      );
    }

    if (!window.google?.accounts) {
      return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <Button color="secondary" disabled style={{ width: '100%' }}>
            Загрузка Google API...
          </Button>
        </div>
      );
    }

    if (!name) {
      return (
        <div style={{ textAlign: 'center' }}>
          {/* КОНТЕЙНЕР ДЛЯ КНОПКИ GOOGLE */}
          <div
            id="googleSignInButton"
            style={{
              width: '100%',
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'center'
            }}
          ></div>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: 'rgba(147, 112, 219, 0.2)',
          borderRadius: '10px'
        }}>
          {picture && (
            <img
              src={picture}
              alt={name || ''}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '2px solid #FFD700'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDERS.user;
                (e.target as HTMLImageElement).onerror = null;
              }}
            />
          )}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ color: '#FFD700', fontWeight: 'bold' }}>
              👤 {name}
            </div>
            {email && (
              <div style={{ color: '#E6E6FA', fontSize: '12px' }}>
                📧 {email}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={this.signOut}
          disabled={isLoading}
          style={{
            background: '#DB4437',
            border: 'none',
            width: '100%',
            marginBottom: '10px',
            padding: '10px'
          }}
        >
          {isLoading ? 'Выход...' : '🚪 Выйти'}
        </Button>
      </div>
    );
  }
}

export default ButtonGoogleAuth;