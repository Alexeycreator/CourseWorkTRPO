import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    gapi: any;
  }
}

interface ButtonGoogleAuthState {
  name: string | null;
  isGapiLoaded: boolean;
}

interface GoogleUserProfile {
  getName: () => string;
  getEmail: () => string;
  getImageUrl: () => string;
}

interface GoogleUser {
  getBasicProfile: () => GoogleUserProfile;
}

class ButtonGoogleAuth extends React.Component<{}, ButtonGoogleAuthState> {
  state: ButtonGoogleAuthState = {
    name: null,
    isGapiLoaded: false
  };

  componentDidMount() {
    this.loadGapi();
  }

  loadGapi = () => {
    // Проверяем, загружен ли gapi
    if (window.gapi) {
      this.initializeGapi();
    } else {
      // Если не загружен, ждем события загрузки
      const checkInterval = setInterval(() => {
        if (window.gapi) {
          clearInterval(checkInterval);
          this.initializeGapi();
        }
      }, 100);

      // Таймаут на случай, если скрипт не загрузился
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.gapi) {
          console.error("Google API failed to load");
          this.setState({ isGapiLoaded: false });
        }
      }, 5000);
    }
  };

  initializeGapi = () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id: process.env.REACT_APP_CLIENT_ID_GOOGLE,
        })
        .then(
          () => {
            console.log("Google Auth initialized successfully");
            this.setState({ isGapiLoaded: true });
          },
          (error: Error) => {
            console.log("Google Auth initialization error:", error);
            this.setState({ isGapiLoaded: false });
          }
        );
    });
  };

  signIn = () => {
    if (!this.state.isGapiLoaded) {
      console.error("Google API not loaded yet");
      return;
    }

    const _authOk = (googleUser: GoogleUser) => {
      this.setState({
        name: googleUser.getBasicProfile().getName(),
      });
      console.log("Signed in successfully");
    };

    const _authErr = (error: Error) => {
      console.log("Auth Error:", error);
    };

    try {
      const GoogleAuth = window.gapi.auth2.getAuthInstance();
      if (GoogleAuth) {
        GoogleAuth.signIn({
          scope: "profile email",
        }).then(_authOk, _authErr);
      } else {
        console.error("GoogleAuth not initialized");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  signOut = () => {
    if (!this.state.isGapiLoaded) {
      console.error("Google API not loaded yet");
      return;
    }

    try {
      const GoogleAuth = window.gapi.auth2.getAuthInstance();
      if (GoogleAuth) {
        GoogleAuth.signOut().then(
          () => {
            this.setState({
              name: null,
            });
            console.log("Signed out successfully");
          },
          (error: Error) => console.log("Sign out error:", error)
        );
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  render() {
    const { name, isGapiLoaded } = this.state;

    if (!isGapiLoaded) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Button color="secondary" disabled>
            Загрузка Google API...
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>
          {!name && (
            <Button 
              color="primary" 
              onClick={this.signIn}
              style={{
                background: 'linear-gradient(45deg, #DB4437, #4285F4)',
                border: 'none',
                width: '100%',
                marginBottom: '10px'
              }}
            >
              🔐 Войти через Google
            </Button>
          )}
          {name && (
            <>
              <div style={{ color: '#FFD700', marginBottom: '10px', textAlign: 'center' }}>
                👤 Вы вошли как: {name}
              </div>
              <Button 
                color="primary" 
                onClick={this.signOut}
                style={{
                  background: '#DB4437',
                  border: 'none',
                  width: '100%',
                  marginBottom: '10px'
                }}
              >
                🚪 Выйти
              </Button>
            </>
          )}
          {name && (
            <a
              className="primary-cta"
              href="https://calendar.google.com/calendar/u/0/r?pli=1"
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'block',
                color: '#FFD700',
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '10px'
              }}
            >
              📅 Просмотреть календарь
            </a>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          {name && (
            <Link 
              to="/calendarAgregator"
              style={{
                color: '#9370DB',
                textDecoration: 'none'
              }}
            >
              📊 Агрегатор календарей
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default ButtonGoogleAuth;