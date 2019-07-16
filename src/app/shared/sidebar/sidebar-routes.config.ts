import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
    { path: '/real-ws/pmodel', title: 'Process Model', icon: 'icon-shuffle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    /*{ path: '', title: 'Statistics', icon: 'ft-bar-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
            { path: '/real-ws/cases', title: 'Cases', icon: 'ft-droplet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            { path: '/real-ws/statistics', title: 'Aggregated stats', icon: 'ft-droplet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
        ]
    },*/
    { path: '/real-ws/cases', title: 'Cases', icon: 'ft-airplay', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    { path: '/real-ws/statistics', title: 'Aggregated stats', icon: 'ft-trending-up', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    { path: '/real-ws/sna', title: 'SNA', icon: 'ft-share-2', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    { path: '/real-ws/transient', title: 'Transient Analysis', icon: 'ft-anchor', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    { path: '/real-ws/privacymaster', title: 'Privacy', icon: 'ft-hash', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
];
