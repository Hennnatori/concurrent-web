import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { type Profile } from '@concurrent-world/client'
import Button from '@mui/material/Button'
import { useApi } from '../context/api'
import { CCAvatar } from './ui/CCAvatar'
import Background from '../resources/defaultbg.png'
import { alpha, useTheme } from '@mui/material'

interface ProfileEditorProps {
    initial?: Profile
    onSubmit?: (profile: Profile) => void
    id?: string
}

export function ProfileEditor(props: ProfileEditorProps): JSX.Element {
    const client = useApi()
    const theme = useTheme()
    const [username, setUsername] = useState<string>(props.initial?.username ?? '')
    const [avatar, setAvatar] = useState<string>(props.initial?.avatar ?? '')
    const [description, setDescription] = useState<string>(props.initial?.description ?? '')
    const [banner, setBanner] = useState<string>(props.initial?.banner ?? '')

    const updateProfile = async (): Promise<void> => {
        if (props.id === undefined) {
            client.createProfile(username, description, avatar, banner).then((data) => {
                console.log(data)
                props.onSubmit?.(data)
            })
        } else {
            client.updateProfile(props.id, username, description, avatar, banner).then((data) => {
                console.log(data)
                props.onSubmit?.(data)
            })
        }
    }

    useEffect(() => {
        setUsername(props.initial?.username ?? '')
        setAvatar(props.initial?.avatar ?? '')
        setDescription(props.initial?.description ?? '')
        setBanner(props.initial?.banner ?? '')
    }, [props.initial])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '15px',
                backgroundImage: `url(${banner || Background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '15px'
            }}
        >
            <CCAvatar
                avatarURL={avatar}
                identiconSource={client.ccid}
                sx={{
                    width: '64px',
                    height: '64px'
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '15px',
                    gap: '5px',
                    flex: 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    borderRadius: '5px',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                <TextField
                    label="username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                <TextField
                    label="description"
                    variant="outlined"
                    value={description}
                    multiline
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                />
                <TextField
                    label="avatarURL"
                    variant="outlined"
                    value={avatar}
                    onChange={(e) => {
                        setAvatar(e.target.value)
                    }}
                />
                <TextField
                    label="bannerURL"
                    variant="outlined"
                    value={banner}
                    onChange={(e) => {
                        setBanner(e.target.value)
                    }}
                />
                <Button
                    variant="contained"
                    onClick={(_) => {
                        updateProfile()
                    }}
                >
                    {props.id === undefined ? '新規作成' : '更新'}
                </Button>
            </Box>
        </Box>
    )
}
