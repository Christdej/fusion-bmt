import React, { useState } from 'react'

import { Box } from '@material-ui/core'
import { Button, Typography, Icon } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'

import { Action, Participant, Question } from '../../api/models'
import ActionEditSidebar from './EditForm/ActionEditSidebar'
import PriorityIndicator from './PriorityIndicator'
import { DataToCreateAction } from '../../api/mutations'
import ActionCreateSidebar from './CreateForm/ActionCreateSidebar'

interface Props {
    question: Question
    isActionSaving: boolean
    isNoteSaving: boolean
    participants: Participant[]
    onActionCreate: (action: DataToCreateAction) => void
    onActionEdit: (action: Action) => void
    onNoteCreate: (actionId: string, text: string) => void
}

const QuestionActionsList = ({
    question,
    participants,
    onActionCreate,
    onActionEdit,
    onNoteCreate,
    isActionSaving,
    isNoteSaving,
}: Props) => {
    const [isEditSidebarOpen, setIsEditSidebarOpen] = useState<boolean>(false)
    const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState<boolean>(false)
    const [actionToEditId, setActionToEditId] = useState<string | undefined>()
    const actions = [...question.actions]

    const openActionEditSidebar = (action: Action) => {
        setIsEditSidebarOpen(true)
        setActionToEditId(action.id)
    }

    const onClose = () => {
        setIsEditSidebarOpen(false)
        setIsCreateSidebarOpen(false)
        setActionToEditId(undefined)
    }

    return (
        <>
            <Box paddingLeft="9rem">
                <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography variant="body_short" bold>
                            Actions
                        </Typography>
                    </Box>
                    <Box>
                        <Button variant="ghost" onClick={() => setIsCreateSidebarOpen(true)}>
                            <Icon data={add}></Icon>
                            Add action
                        </Button>
                    </Box>
                </Box>
                {actions
                    .sort((a1, a2) => {
                        if (a1.createDate < a2.createDate) {
                            return -1
                        }
                        if (a1.createDate > a2.createDate) {
                            return 1
                        }
                        return 0
                    })
                    .map(action => {
                        return (
                            <div key={action.id}>
                                <Box display="flex">
                                    <Box p="0.3rem">
                                        <PriorityIndicator priority={action.priority} />
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Typography link onClick={() => openActionEditSidebar(action)}>
                                            {action.title}
                                        </Typography>
                                        {action.completed && (
                                            <Typography bold italic>
                                                &nbsp;{'- Completed'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </div>
                        )
                    })}
                {actions.length === 0 && <Typography italic>No actions added</Typography>}
            </Box>
            {actionToEditId !== undefined &&
                <ActionEditSidebar
                    action={actions.find(a => a.id === actionToEditId)!}
                    isActionSaving={isActionSaving}
                    isNoteSaving={isNoteSaving}
                    open={isEditSidebarOpen}
                    onClose={onClose}
                    connectedQuestion={question}
                    possibleAssignees={participants}
                    onActionEdit={action => {
                        onActionEdit(action)
                    }}
                    onNoteCreate={(actionId: string, text: string) => {
                        onNoteCreate(actionId, text)
                    }}
                />
            }
            <ActionCreateSidebar
                open={isCreateSidebarOpen}
                onClose={onClose}
                connectedQuestion={question}
                possibleAssignees={participants}
                onActionCreate={action => {
                    onClose()
                    onActionCreate(action)
                }}
            />
        </>
    )
}

export default QuestionActionsList
