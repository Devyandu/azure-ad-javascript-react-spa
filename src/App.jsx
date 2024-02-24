import React, { useState } from 'react';
import './styles/App.css';
import { PageLayout } from './components/PageLayout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
//import Button from 'react-bootstrap/Button';
import { loginRequest } from './authConfig';
import { callMsGraph } from './graph';
//import { ProfileData } from './components/ProfileData';
import { ListGroup } from 'react-bootstrap';

/**
 *  {graphData? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile Information
                </Button>
            })
 **/
/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
        {console.log(accounts[0])}
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
           
            <hr/>

            
            <ListGroup as="ul">
            <ListGroup.Item  active as="li"><h5>Some Logged in Content</h5></ListGroup.Item>
           
            <ListGroup.Item as="li" >
            <strong>Role:</strong>{accounts[0].idTokenClaims.roles[0]}
            </ListGroup.Item>
            <ListGroup.Item  as="li"><strong>Email from AD:</strong>{accounts[0].username}</ListGroup.Item>
           
            </ListGroup>

            
           
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in. The app will use the JWT to get your role  information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
