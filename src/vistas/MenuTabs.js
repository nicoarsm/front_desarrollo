import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Autor from './Autor'
import Prestamo from './prestamo'
import Libro from './libro';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function MenuTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        const token = localStorage.getItem('TOKEN_APP_TALLER');
        // if(token==null)
        // {
        //   window.location='/';
        // }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Libro" {...a11yProps(0)} />
                    <Tab label="Autor" {...a11yProps(1)} />
                    <Tab label="Prestamo" {...a11yProps(2)} />
                    <Tab label="Nuevo" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Libro />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Autor />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Prestamo />
            </TabPanel>

            <TabPanel value={value} index={3}>
                Aqui va a ir el menu nuevo
      </TabPanel>
        </div>
    );
}
