import React, { Component } from 'react';
import { Services } from './Services'
import { ContentfulClientApi } from 'contentful';
import { ServicesFilterInput, ServiceFilter } from './ServicesFilterInput';
import "./TermCard.css"
import { BallClipRotate } from 'react-pure-loaders';
import { SeriesServices } from './Series';
import { Service, Term } from './Types';
import { tsModuleDeclaration } from '@babel/types';

type Props = {
    termName?: string
    contentfulClient: ContentfulClientApi
}

type State = {
    enabledFilter?: ServiceFilter,
    term?: Term
    error?: string
    showPastServices: boolean
}

let serviceFilters: ServiceFilter[] = [
    {
        name: "10:15",
        filter: (service: Service) => { return service.time === "10:15" }
    },
    {
        name: "18:00",
        filter: (service: Service) => { return service.time === "18:00" }
    }
]

export class TermCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {term: undefined, showPastServices: false }
        this.updateFilter = this.updateFilter.bind(this)
        this.updateShowPast = this.updateShowPast.bind(this)

        let query: any
        if (this.props.termName) {
            console.log("Getting termcard by name")
            query = { "content_type": "term", "fields.title": this.props.termName }
        } else {
            console.log("Getting termcard based on today's date")
            let today = new Date();
            // let todayQueryString = "" + today.getUTCMonth() + "-" + today.getUTCDate() + "-" + today.getFullYear();
            let todayQueryString = today.toISOString()
            console.log(todayQueryString)
            query = { "content_type": "term", "fields.start[lte]": todayQueryString, "fields.end[gte]": todayQueryString}
        }
        
        this.props.contentfulClient.getEntries(query)
        .then(response => {
            let fields = response.items[0].fields as any

            let term: Term = { title: fields.title, startDate: new Date(fields.start), endDate: new Date(fields.end) }
            this.setState({ term: term })
        }).catch(error => {
            this.setState({ error: "There was a problem loading data for the termcard. Sorry." })
        })
    }

    updateFilter(enabledFilter?: ServiceFilter) {
        this.setState({ enabledFilter: enabledFilter })
    }

    updateShowPast(showPast: boolean) {
        console.log(showPast)
        this.setState({showPastServices: showPast})
    }

    render() {

        let services
        if (this.state.error) {
            services = <div>{this.state.error}</div>
        } else if (this.state.term) {
            services = <Services showPastServices={this.state.showPastServices} contentfulClient={this.props.contentfulClient} filters={this.state.enabledFilter ? [this.state.enabledFilter] : []} startDate={this.state.term.startDate} endDate={this.state.term.endDate}></Services>
        } else {
            services = <BallClipRotate loading />
        }

        let season = <SeriesServices title="Christmas at Christ Church" contentfulClient={this.props.contentfulClient} seriesName="Christmas 2019" filters={[]}></SeriesServices>

        return <div className="termcard">
            <div className="heading">
                <a className="logo" href="/">
                    <svg viewBox="0 0 163 163">
                        <use  xlinkHref="images/ccm-logo-square.svg#ccm-logo-square" />
                    </svg>
                </a>
                <h1>{this.state.term ? this.state.term.title : "Current Term"}</h1>
                <ServicesFilterInput includePastFilterOption={true} onUpdateShowPast={this.updateShowPast} exclusiveFilters={serviceFilters} onUpdate={this.updateFilter}></ServicesFilterInput>
            </div>
            {services}
            {season}
        </div>
    }
}