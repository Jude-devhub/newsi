'use client';

const ErrorPage: React.FC = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f8d7da',
        color: '#721c24'
    }}>
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn't load the page. Please try again later.</p>
    </div>
);

export default ErrorPage;