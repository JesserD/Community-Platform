import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { useNavigate } from 'react-router-dom';

const Navigator = () => {
    const history = useNavigate();
    const { userStore: { navigate } } = useStore();
    useEffect(() => {
        if (navigate)
            history(navigate);
    }, [navigate, history]);

    return (<></>);
};

export default observer(Navigator);