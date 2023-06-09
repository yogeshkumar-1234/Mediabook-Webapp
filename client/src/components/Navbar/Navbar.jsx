import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Typography, Toolbar, Button, Avatar } from '@mui/material'
import { useDispatch } from 'react-redux'
import { Root, classes } from './styles'
import { useEffect, useCallback } from 'react'
import memories from '../../images/memoriesText.png'
import icon from '../../images/icon.png'
import decode from 'jwt-decode'
import Avaatar from 'avataaars'

const Navbar = ({ user, setUser }) => {
	const token = user?.token
	const dispatch = useDispatch()
	const history = useNavigate()
	const location = useLocation()
	const userIsinAuth = location.pathname === '/auth'

	const logout = useCallback(() => {
		dispatch({ type: 'LOGOUT' })
		history('/')
		setUser(null)
	}, [history, dispatch, setUser])

	useEffect(() => {
		if (token) {
			const decodedToken = decode(token)
			if (decodedToken.exp * 1000 < new Date().getTime()) logout()
		}
		setUser(JSON.parse(localStorage.getItem('profile')))
	}, [logout, token, setUser])
	return (
		<Root className={classes.root}>
			<AppBar className={classes.appBar} position="static">
				<Link to="/" className={classes.brandContainer}>
					<img className={classes.logo} src={icon} alt="memories" height="40" />
					{/* <img className={classes.heading} src={memories} alt="memories" height="70" /> */}
					<h1>       MEDIABOOK</h1>
				</Link>
				<Toolbar className={classes.toolbar}>
					{user ? (
						<div className={classes.profile}>
							<Link to="/user" className={classes.brandContainer}>
								{user.result.avatar ? (
									<Avaatar className={classes.avaatar} avatarStyle="Circle" {...user.result.avatar} />
								) : (
									<Avatar className={classes.avatar} alt={user.result.name} src={user.result.imageUrl}>
										{user.result.name.charAt(0)}
									</Avatar>
								)}
							</Link>
							<Typography className={classes.userName} variant="h6">
								{user.result.name}
							</Typography>
							<Button className={classes.logout} variant="contained" onClick={logout}>
								Logout
							</Button>
						</div>
					) : (
						!userIsinAuth && (
							<Button className={classes.logout} component={Link} to="/auth" variant="contained">
								Sign In
							</Button>
						)
					)}
				</Toolbar>
			</AppBar>
		</Root>
	)
}

export default Navbar
