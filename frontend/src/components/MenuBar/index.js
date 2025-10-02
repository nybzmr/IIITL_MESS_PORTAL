import classes from "./index.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Fade from "../../utility/fade";
import axios from "axios";
import {
    MenuOutlined,
    CloseOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    QrcodeOutlined,
    CalendarOutlined,
    TableOutlined,
    SettingOutlined,
    SolutionOutlined,
    ScanOutlined
} from '@ant-design/icons';
import { Menu, message } from 'antd';

const getItem = (label, link, icon, key) => {
    return (
        <Menu.Item key={key} icon={icon}>
            <Link to={link}>{label}</Link>
        </Menu.Item>
    );
};

const getLoginItem = (label, link, icon, key) => {
    return (
        <Menu.Item key={key} icon={icon}>
            <a href={link}>{label}</a>
        </Menu.Item>
    );
};

export default function MenuBar() {
    const [open, setopen] = useState(false);

    const [status, setStatus] = useState({
        loggedIn: false,
        admin: false
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(
                    `${window.APIROOT}api/data/status`
                );

                setStatus(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch authentication status:",
                    error
                );

                message.error(
                    "Failed to fetch data from server"
                );
            }
        };

        fetchStatus();
    }, []);

    const loginUrl =
        `${window.APIROOT}api/auth/signin`;

    const logoutUrl =
        `${window.APIROOT}api/auth/signout`;

    return (
        <>
            <div className={classes.menu}>
                <div className={classes.logo}>
                    <span>IIITL MESS PORTAL</span>
                </div>

                <motion.div
                    className={classes.navWrap}
                    animate={{
                        x: open ? 0 : "-15rem"
                    }}
                    transition={{
                        duration: 0.3
                    }}
                >
                    <Menu
                        className={classes.nav}
                        theme="light"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onClick={() =>
                            setopen(!open)
                        }
                    >
                        {getLoginItem(
                            status.loggedIn
                                ? 'Sign out'
                                : 'Sign in',

                            status.loggedIn
                                ? logoutUrl
                                : loginUrl,

                            <UserOutlined />,
                            '2'
                        )}

                        {status.loggedIn ? (
                            <>
                                <Menu.Divider />

                                {getItem(
                                    'Schedule',
                                    '/',
                                    <TableOutlined />,
                                    '3'
                                )}

                                {getItem(
                                    'Buy coupons',
                                    '/buy-coupons',
                                    <ShoppingCartOutlined />,
                                    '4'
                                )}

                                {getItem(
                                    'Purchase history',
                                    '/purchase-history',
                                    <CalendarOutlined />,
                                    '5'
                                )}

                                {getItem(
                                    'QR code',
                                    '/qr-code',
                                    <QrcodeOutlined />,
                                    '6'
                                )}

                                {status.admin ? (
                                    <>
                                        <Menu.Divider />

                                        {getItem(
                                            'Admin panel',
                                            '/admin',
                                            <SettingOutlined />,
                                            '7'
                                        )}

                                        {getItem(
                                            'Total meals',
                                            '/total-meals',
                                            <SolutionOutlined />,
                                            '8'
                                        )}

                                        {getItem(
                                            'Scan QR code',
                                            '/scan-qr',
                                            <ScanOutlined />,
                                            '9'
                                        )}
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </Menu>

                    <div
                        className={classes.navBtn}
                        onClick={() =>
                            setopen(!open)
                        }
                    >
                        <Fade
                            one2Two={open}
                            one={
                                <CloseOutlined />
                            }
                            two={
                                <MenuOutlined />
                            }
                        />
                    </div>

                    <div
                        className={classes.logoCover}
                    />
                </motion.div>
            </div>

            <div className={classes.gap} />
        </>
    );
}