type User = {
    id: string;
    name: string;
    email: string;
    token: string; // Add other fields if necessary
    };
    
    type AuthState = {
        currentUser: User | null;
        userToken: string | null;
    };
    
    type AuthAction =
        | { type: 'LOGIN'; payload: User }
        | { type: 'LOGOUT' }
        | { type: 'SET_USER'; payload: User };
    
    const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
        switch (action.type) {
        case 'LOGIN':
            return {
                currentUser: action.payload,
                userToken: action.payload.token, // Storing token in state
            };
        case 'LOGOUT':
            return {
                currentUser: null,
                userToken: null,
            };
        case 'SET_USER':
            return {
                ...state,
                currentUser: action.payload,
            };
        default:
            return state;
        }
    };
    
export default AuthReducer;