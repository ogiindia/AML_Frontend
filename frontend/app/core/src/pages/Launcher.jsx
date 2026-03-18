import {
    FullWidthSubmitButton,
    MutedBgLayout,
    SimpleCard
} from '@ais/components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reset as resetAuth } from '../redux/authSlice';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';
import { useBrandingValue } from '../utilites/useBranding';

export default function Launcher() {
    const { globalState, updateGlobalState } = useGlobalContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get activeApps (modules with full data including 'active' property)
    const activeApps = globalState.apps || [];

    // Filter only active modules
    const activeModules = activeApps.filter(app => app.active === true);

    // moduleKeyList is expected to be an object mapping keys -> names
    const modules = globalState.moduleKeyList || {};

    const title = useBrandingValue('launcherTitle', 'Application Launcher');
    const tagline = useBrandingValue('launcherTagline', 'Select an application to continue.');
    const logo = useBrandingValue('assets.logo', './logo.png');

    const openApp = (key) => {
        updateGlobalState({ module_key: key, module_name: modules[key] });
        navigate('/home');
    };

    const logout = () => {
        dispatch(resetAuth());
        updateGlobalState({ username: null, auth: null, initApp: false });
        navigate('/login');
    };

    // Get module keys only from active modules
    const moduleKeys = activeModules.map(app => app.appId).filter(key => key in modules);

    return (
        <MutedBgLayout>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-6xl space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={logo} alt="logo" style={{ height: 48 }} />
                        <div>
                            <h2 className="text-2xl font-semibold">{title}</h2>
                            <div className="text-sm text-muted">{tagline}</div>
                        </div>
                    </div>
                    {moduleKeys.length === 0 && (
                        <SimpleCard title="No Applications">
                            <p>No active apps available for your account.</p>
                            <div className="mt-4">
                                {/* <FullWidthSubmitButton onClick={logout} label="Logout" /> */}
                            </div>
                        </SimpleCard>
                    )}

                    {moduleKeys.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {moduleKeys.map((key) => {
                                const label = modules[key];
                                return (
                                    <SimpleCard key={key} title={label} className="p-4">
                                        <div className="flex flex-col justify-between h-full">
                                            <div className="mb-4 text-sm text-muted">Open the {label} application.</div>
                                            <div>
                                                <FullWidthSubmitButton onClick={() => openApp(key)} label={`Open ${label}`} />
                                            </div>
                                        </div>
                                    </SimpleCard>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6">
                        <FullWidthSubmitButton onClick={logout} label="Logout" />
                    </div>
                </div>
            </div>
        </MutedBgLayout>
    );
}
