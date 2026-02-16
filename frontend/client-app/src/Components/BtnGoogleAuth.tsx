import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

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

  loadGoogleScript = () => {
    if (window.google?.accounts) {
      this.initializeGoogle();
      return;
    }

    // Проверяем загрузку скрипта
    const checkInterval = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(checkInterval);
        this.initializeGoogle();
      }
    }, 100);

    // Таймаут на случай ошибки
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.google?.accounts) {
        this.setState({ 
          loadError: 'Не удалось загрузить Google API',
          isLoading: false
        });
      }
    }, 5000);
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

    console.log("✅ Google Identity Services initialized");
    this.setState({ isLoading: false, loadError: null });
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
      
      console.log("✅ Signed in as:", payload.name);
    } catch (error) {
      console.error("❌ Error parsing credential:", error);
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
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          this.setState({ 
            isLoading: false,
            loadError: 'Окно авторизации не открылось автоматически'
          });
        }
      });
    } catch (error) {
      console.error("❌ Error during sign in:", error);
      this.setState({ 
        isLoading: false,
        loadError: 'Ошибка при открытии окна авторизации'
      });
    }
  };

  signOut = () => {
    if (!window.google?.accounts) return;

    this.setState({ isLoading: true });

    try {
      window.google.accounts.id.disableAutoSelect();
      this.setState({
        name: null,
        email: null,
        picture: null,
        isLoading: false
      });
      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Error during sign out:", error);
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
          <Button
            color="primary"
            onClick={this.signIn}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(45deg, #DB4437, #4285F4)',
              border: 'none',
              width: '100%',
              marginBottom: '10px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isLoading ? 'Загрузка...' : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Войти через Google
              </>
            )}
          </Button>
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