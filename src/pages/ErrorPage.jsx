import {useRouteError, NavLink} from 'react-router-dom';

export const ErrorPage = () => {
    const error = useRouteError();
    console.log(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
            <h1 className="text-5xl font-extrabold text-red-600 mb-8">Oops!</h1>
            <p className="text-xl md:text-2xl text-center mb-8">An unexpected error occurred.</p>
            {error && error.statusText && (
                <p className="text-lg text-gray-600 mb-2">
                    <span className="font-semibold">Status:</span> {error.status}
                </p>
            )}
            {error && error.data && (
                <p className="text-lg text-gray-600 mb-8 max-w-lg text-center">
                    <span className="font-semibold">Message:</span> {error.data}
                </p>
            )}
            <NavLink to='/' className="mt-2">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    Go back
                </button>
            </NavLink>
        </div>
    );
};