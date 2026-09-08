import React from 'react';
import _ from 'lodash';

import { 
    Badge,
    Progress
} from './../../../components';

const sensors = [
    <td className="align-middle">
        <span className="text-inverse">NH3</span> <span className="small">(pump)</span>
    </td>,
    <td className="align-middle">
        <span className="text-inverse">H2S</span> <span className="small">(airC)</span>
    </td>,
    <td className="align-middle">
        <span className="text-inverse">Odor</span> <span className="small">(bubble)</span>
    </td>,
    <td className="align-middle">
        <span className="text-inverse">VOC</span> <span className="small">(circulator)</span>
    </td>,
];


/*eslint-disable */
const status = [
    <td>
        양호 <i className="fa fa-fw fa-check-circle text-success"></i>
    </td>,
    <td>
        이상 <i className="fa fa-fw fa-exclamation-circle text-danger"></i>
    </td>
];
/*eslint-enable */

/*eslint-disable */
const tasksCompleted = [
    "25",
    "50",
    "70",
    "90"
];
/*eslint-enable */

const TrTableMonitor = () => (
    <React.Fragment>
        {
            _.times(14, (index) => (
                <tr key={ index } className="text-nowrap">
                    { sensors[index%4] }
                    { status[index%2] }
                    <td className="align-middle">
                        진안 <Badge color="secondary" pill className="ml-2">22.3, 65.2</Badge>
                    </td>
                    <td className="align-middle">
                        <Progress value={ tasksCompleted[index%4] } style={{height: "5px"}} />
                    </td>
                    <td>
                        <span className="text-inverse">56 ppm</span> / 80 ppm
                    </td>
                    
                </tr>
            ))
        }
    </React.Fragment>
)

export { TrTableMonitor };
