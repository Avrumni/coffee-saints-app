import * as React from 'react';
import {connect, DispatchProp} from 'react-redux';
import {Link} from "react-router-dom";
import {SaintStore} from "../saint.store";
import {RouteComponentProps} from "react-router";
import {BuyerActions} from "../../buyer/buyer.actions";
import {SaintActions} from '../saint.actions';

class SaintChooserComponent extends React.Component<SaintChooserComponentProps, SaintChooserComponentState> {
    constructor(props: SaintChooserComponentProps) {
        super(props);
        this.state = {
            selectedSaints: [],
            toggleAll: true
        };

        this.props.dispatch(SaintActions.find());
    }

    public whoBuys(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let saintIds: number[] = this.state.selectedSaints
            .filter((selectedSaint) => {
                return selectedSaint.isSelected ? selectedSaint : false;

            }).map((selectedSaint) => {
                return selectedSaint.saint.id;
            });

        console.log('selected', saintIds);

        this.props.dispatch(BuyerActions.find(saintIds))
            .then(() => this.props.history.push('/buy'));
    }

    public toggleSaint(index: number) {
        this.state.selectedSaints[index].isSelected =
            !this.state.selectedSaints[index].isSelected;

        this.setState({
            ...this.state
        });
    }

    public toggleAllSaints() {
        let toggleAll = !this.state.toggleAll;

        this.state.selectedSaints.forEach((selectedSaint) => {
            selectedSaint.isSelected = !toggleAll;
        });

        this.setState({
            ...this.state,
            toggleAll
        });
    }

    public render() {
        let saintsLoading = this.props.saints.saintsList.loading;

        this.props.saints.saintsList.saints.forEach((saint) => {
            this.state.selectedSaints.push({
                saint: saint,
                isSelected: false
            });
        });

        return (<form className="saint-chooser" onSubmit={(e) => (this.whoBuys(e))}>
            <div>
                <h1>Select saints to find out who buys?</h1>
                <button type="submit" disabled={!(this.props.saints.saintsList.saints.length > 0)}>Find out who buys
                </button>
                <Link className="add action" to="/add">Add a saint</Link>
            </div>
            <div>
                {this.saintList(saintsLoading)}
            </div>
            <div>
            </div>
        </form>);
    }

    private saintList(loading: boolean) {
        if (loading) {
            return (<div className="loading">Loading...</div>);
        }
        else {
            return (<ul className="saint-list">
                <li>
                    <label className="selectAll">Select All</label>
                    <input name="saintSelectAll" ref="saintSelectAll" type="checkbox"
                           onChange={() => {
                               this.toggleAllSaints();
                           }}/>
                </li>
                {this.state.selectedSaints.map((selectedSaint, index) => {
                    return this.saintItem(selectedSaint, index);
                })}</ul>);
        }
    }

    private saintItem(selectedSaint: any, index: number) {
        return (
            <li key={index}>
                <input name="saintSelect" ref="saintSelect" id={'saint' + selectedSaint.saint.id} type="checkbox"
                       value={selectedSaint.saint.id}
                       checked={selectedSaint.isSelected}
                       onChange={() => {
                           this.toggleSaint(index)
                       }}/>
                <label htmlFor={'saint' + selectedSaint.saint.id}>
                    <div className="name">
                        {selectedSaint.saint.name}
                        <div className="bought">
                            <span>Bought:</span>
                            {selectedSaint.saint.coffeeBought}
                        </div>
                        <div className="consumed">
                            <span>Consumed:</span>
                            {selectedSaint.saint.coffeeConsumed}
                        </div>
                    </div>
                    <div className="thumb"><img className="default" src="/assets/beansus.svg"/></div>
                </label>
            </li>
        );
    }
}

export default connect((state) => ({saints: state.saintReducer}))(SaintChooserComponent);

interface SaintChooserComponentProps extends DispatchProp<any>, RouteComponentProps<any> {
    saints: SaintStore
}

interface SaintChooserComponentState {
    selectedSaints: any[],
    toggleAll: boolean
}