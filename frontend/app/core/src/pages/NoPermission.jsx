import { FullWidthSubmitButton, MutedBgLayout, SimpleCard } from '@ais/components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reset as resetAuth } from '../redux/authSlice';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';

export default function NoPermission() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { updateGlobalState } = useGlobalContext();

    const handleBackToLauncher = () => {
        updateGlobalState({ module_key: null, module_name: null });
        navigate('/launcher');
    };

    const handleLogout = () => {
        dispatch(resetAuth());
        updateGlobalState({ username: null, auth: null, initApp: false });
        navigate('/login');
    };

    return (
        <MutedBgLayout>
            <div className="flex items-center justify-center min-h-screen p-4">
                <SimpleCard title="Not enough permission to access this module." className="max-w-md w-full">
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <FullWidthSubmitButton
                                onClick={handleBackToLauncher}
                                label="Back to Launcher"
                            />
                            <FullWidthSubmitButton
                                onClick={handleLogout}
                                label="Logout"
                                variant="outline"
                            />
                        </div>
                    </div>
                </SimpleCard>
            </div>
        </MutedBgLayout>
    );
}
