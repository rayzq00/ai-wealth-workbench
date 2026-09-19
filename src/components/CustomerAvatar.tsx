import { Avatar } from 'antd'

const avatarPalette = [
  { color: '#c95766', background: '#fae9ec', border: '#f3cfd5' },
  { color: '#655cc3', background: '#eeecfb', border: '#dcd8f4' },
  { color: '#b7792c', background: '#fbf0df', border: '#f1ddbd' },
  { color: '#2f826f', background: '#e5f3ef', border: '#cde6df' },
  { color: '#3975b9', background: '#e8f0fa', border: '#cfdef0' },
]

export function CustomerAvatar({ name, size = 40 }: { name: string; size?: number }) {
  const index = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0) % avatarPalette.length
  const palette = avatarPalette[index]

  return (
    <Avatar
      size={size}
      className="customer-avatar"
      style={{ color: palette.color, backgroundColor: palette.background, borderColor: palette.border }}
    >
      {name[0]}
    </Avatar>
  )
}
