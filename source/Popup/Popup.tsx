import React, {useEffect, useState} from 'react';
import {
    assignTaggedUsers, breakoutRoomsManagementIsOpened,
    hasBreakoutRoomsButton
} from "../ContentScript/content-script-types";
import styled from "@emotion/styled";
import {executeInZoom} from "./util";

// function openWebPage(url: string): Promise<Tabs.Tab> {
//     return browser.tabs.create({url});
// }

const Container = styled.section`
  height: 10rem;
  width: 20rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
`

const Title = styled.h3`
  
`

const Footnote = styled.p`
  font-style: italic;
`

const Button = styled.button`
  color: #4d90fe;
`;

const Popup: React.FC = () => {
    console.log("Popup Render ", new Date());
    const [isWaiting, setIsWaiting] = useState(true)
    const [userHasBreakoutButton, setUserHasBreakoutButton] = useState(false)
    const [breakoutManagementIsOpened, setBreakoutManagementOpened] = useState(false)
    const [isDone, setIsDone] = useState(false)

    useEffect(() => {
        executeInZoom<boolean>(hasBreakoutRoomsButton)
            .then(userIsHost => {
                setUserHasBreakoutButton(userIsHost)
                console.log("hasBreakoutRoomsButton returned: ", userIsHost)

                if (userIsHost) {
                    executeInZoom<boolean>(breakoutRoomsManagementIsOpened)
                        .then(canShowAssignButton => {
                            setBreakoutManagementOpened(canShowAssignButton)
                            setIsWaiting(false)
                        })
                } else {
                    setIsWaiting(false)
                }
            })
    }, [])

    function content() {
        if (isDone) {
            return <p>Done!</p>
        }
        if (isWaiting) {
            return <p>⌛ Waiting ...</p>
        } else if (userHasBreakoutButton) {
            if (breakoutManagementIsOpened) {
                return (<>
                    <p>Status: You are the host.</p>
                    <Button onClick={() => {
                        setIsWaiting(true)
                        executeInZoom<void>(assignTaggedUsers).then(() => {
                            setIsWaiting(false)
                            setIsDone(true)
                        })
                    }}>Assign By Tag</Button>
                </>)
            } else {
                return (<>
                        <p>Status: You are the host.</p>
                        <p>Manually Create / Recreate breakout rooms, and re-open me once you are on the Zoom screen with the "Assign" buttons.</p>
                    </>
                )
            }

        } else {
            return <p>You don't seem to be host in a Zoom meeting on this page. Once you are host, re-open me.</p>
        }
    }

    return (
        <Container>
            <Title>⚡ UBC Zoom Breakout Rooms Extension ⚡</Title>
            {content()}
            <Footnote>Please email any bugs, issues, and suggestions to john.hua.zou@gmail.com</Footnote>
        </Container>
    )
    // return (
    //   <section id="popup">
    //     <h2>UBC Zoom TA Helper</h2>
    //       <button type="button" onClick={async () => {
    //           const isBO = await executeInZoom<boolean>(hasBreakoutRoomsButton);
    //           if (isBO) {
    //               console.log("Breakout Rooms Button exists")
    //           } else {
    //               console.log("Breakout Rooms Button doesn't exist")
    //           }
    //       }}>
    //           Click Me!
    //       </button>
    //     <button
    //       id="options__button"
    //       type="button"
    //       onClick={(): Promise<Tabs.Tab> => {
    //         return openWebPage('options.html');
    //       }}
    //     >
    //       Options Page
    //     </button>
    //     <div className="links__holder">
    //       <ul>
    //         <li>
    //           <button
    //             type="button"
    //             onClick={(): Promise<Tabs.Tab> => {
    //               return openWebPage(
    //                 'https://github.com/abhijithvijayan/web-extension-starter'
    //               );
    //             }}
    //           >
    //             GitHub
    //           </button>
    //         </li>
    //       </ul>
    //     </div>
    //   </section>
    // );
};

export default Popup;
