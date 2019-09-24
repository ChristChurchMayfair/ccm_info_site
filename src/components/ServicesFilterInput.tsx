import React, { Component } from 'react';
import { Service } from './Types';
import './ServiceFilterInput.css'

export type ServiceFilter = {
    name: string
    filter: (service: Service) => boolean
}

type Props = {
    exclusiveFilters: ServiceFilter[]
    onUpdate: (enabledServiceFilter?: ServiceFilter) => void
    onUpdateShowPast: (showPastServices: boolean) => void
    includePastFilterOption: boolean
}

type State = {
    enabledFilter?: ServiceFilter
    showPast: boolean
}

export class ServicesFilterInput extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.handlePastButton = this.handlePastButton.bind(this);

        this.state = {showPast: false}
    }

    handleClick(filterForButtonClicked: ServiceFilter) {
        // let location = this.state.enabledFilters.indexOf(value)

        // var currentFilters = this.state.enabledFilters
        // var newFilters: ServiceFilter[]

        // if (location !== -1) {
        //     newFilters = currentFilters.filter(function(_,index, arr){
        //         return index !== location
        //     })
        // } else {
        //     currentFilters.push(value)
        //     newFilters = currentFilters
        // }
        // this.props.onUpdate(newFilters)
        if (this.state.enabledFilter === filterForButtonClicked) {
            this.props.onUpdate(undefined)
            this.setState({enabledFilter: undefined})
        } else {
            this.props.onUpdate(filterForButtonClicked)
            this.setState({enabledFilter: filterForButtonClicked})
        }
    }

    handlePastButton() {
        this.props.onUpdateShowPast(!this.state.showPast)
        this.setState({showPast: !this.state.showPast})
    }

    render() {
        let showPastButton
        if (this.props.includePastFilterOption) {
            let buttonClass = this.state.showPast ? "enabled" : "disabled"
            showPastButton = <button className={buttonClass} onClick={() => this.handlePastButton()}>Show Past Services</button>
        } else {
            showPastButton = ""
        }

        return <div className="filters">
            {/* <div>Filters:</div> */}
            <div className="filterButtons">
            {this.props.exclusiveFilters.map(filter => {
                let filterButtonClass = this.state.enabledFilter !== filter ? "disabled" : "enabled"
                return <button key={filter.name} className={[filterButtonClass, "serviceFilter"].join(" ")} onClick={() => this.handleClick(filter)}>{filter.name}</button>
            })}
            {showPastButton}
            </div>
        </div>
    }
}