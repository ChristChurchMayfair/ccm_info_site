import React, { Component } from 'react';
import { Services } from './Services'
import { ContentfulClientApi } from 'contentful';
import { ServicesFilterInput, ServiceFilter } from './ServicesFilterInput';
import "./TermCard.css"
import { BallClipRotate } from 'react-pure-loaders';
import { SeriesServices } from './Series';
import { Service, Term } from './Types';

type Props = {
    termName: string
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
        name: "Show Morning Services Only",
        filter: (service: Service) => { return service.time === "10:15" }
    },
    {
        name: "Show Evening Services Only",
        filter: (service: Service) => { return service.time === "18:00" }
    }
]

export class TermCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {term: undefined, showPastServices: false }
        this.updateFilter = this.updateFilter.bind(this)
        this.updateShowPast = this.updateShowPast.bind(this)
        
        this.props.contentfulClient.getEntries({ "content_type": "term", "fields.title": this.props.termName })
        .then(response => {
            let fields = response.items[0].fields as any

            let term: Term = { startDate: new Date(fields.start), endDate: new Date(fields.end) }
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
                <div></div>
                <h1>{this.props.termName}</h1>
                <ServicesFilterInput includePastFilterOption={true} onUpdateShowPast={this.updateShowPast} exclusiveFilters={serviceFilters} onUpdate={this.updateFilter}></ServicesFilterInput>
            </div>
            {services}
            {season}
        </div>
    }
}