import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔵 AuthProvider: Initializing, checking localStorage...');
        
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('   - Stored user:', storedUser);
        console.log('   - Stored token:', storedToken ? 'Present' : 'Missing');
        
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('✅ AuthProvider: User loaded from localStorage:', parsedUser);
            } catch (error) {
                console.error('❌ AuthProvider: Error parsing stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
            console.log('ℹ️ AuthProvider: No stored user found');
        }
        
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        console.log('🔵 AuthProvider.login called with:', { userData, token });
        
        // Validate inputs
        if (!userData) {
            console.error('❌ AuthProvider.login: No user data provided');
            return;
        }
        
        if (!token) {
            console.error('❌ AuthProvider.login: No token provided');
            return;
        }
        
        // Update state
        setUser(userData);
        console.log('✅ AuthProvider: User state updated');
        
        // Save to localStorage
        try {
            const userString = JSON.stringify(userData);
            localStorage.setItem('user', userString);
            localStorage.setItem('token', token);
            
            console.log('✅ AuthProvider: Data saved to localStorage');
            console.log('   - User saved:', userString);
            console.log('   - Token saved:', token.substring(0, 20) + '...');
            
            // Verify it was saved
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            
            if (savedUser === userString && savedToken === token) {
                console.log('✅ AuthProvider: Verification passed - data correctly saved');
            } else {
                console.error('❌ AuthProvider: Verification failed - data mismatch');
                console.log('   Expected user:', userString);
                console.log('   Actual user:', savedUser);
            }
        } catch (error) {
            console.error('❌ AuthProvider: Error saving to localStorage:', error);
        }
    };

    const logout = () => {
        console.log('🔵 AuthProvider: Logging out');
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('✅ AuthProvider: Logout complete');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};