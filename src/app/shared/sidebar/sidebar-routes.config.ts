import { RouteInfo } from './sidebar.metadata';
import { environment } from '../../../environments/environment';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
    { path: '/real-ws/pmodel', title: 'Process Model', icon: 'icon-shuffle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], isEnabled: true},
    { path: '', title: 'Log Exploration', icon: 'ft-bar-chart', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, isEnabled: true, submenu: [
            { path: '/real-ws/variants', title: 'Variants Explorer', icon: 'ft-airplay', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], isEnabled: true},
            { path: '/real-ws/dotted', title: 'Dotted Chart', icon: 'ft-anchor', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], isEnabled: true},
        ]
    },
    { path: '/real-ws/sna', title: 'SNA', icon: 'ft-share-2', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], isEnabled: environment.overallEnableSNA},
    { path: '/real-ws/transient', title: 'Transient Analysis', icon: 'ft-anchor', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [], isEnabled: environment.overallEnableTransient},
];
