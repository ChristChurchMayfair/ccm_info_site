import React, { Component } from 'react';
import { ContentfulClientApi, } from 'contentful';
import { ServiceView, ServiceFromContentfulItem } from './Service';
import "./Series.css"
import { ServiceFilter } from './ServicesFilterInput';
import { Service } from './Types';

type Props = {
    contentfulClient: ContentfulClientApi
    seriesName: string
    filters: ServiceFilter[]
    title: string
}

type State = {
    services: Service[]
}

export class SeriesServices extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = { services: [] }
    }

    componentDidMount() {
        this.props.contentfulClient
            .getEntries({ "content_type": "service" })
            .then(response => {
                return this.props.contentfulClient.parseEntries<Service>(response)
            })
            .then(response => {
                let services: Service[] = response.items.map(item => ServiceFromContentfulItem(item))
                    .filter(service => service.series && service.series.title === this.props.seriesName)
                this.setState({ services: services })
            }).catch(error => {
                console.log(error)
            })
    }

    render() {

        let services = this.state.services
            .filter(service => {
                return this.props.filters.map(filter => {
                    return filter.filter(service)
                }).reduce((previousValue: boolean, currentValue: boolean, idx, arr: boolean[]) => { return previousValue && currentValue }, true)
            })

        services.sort(function (firstService: Service, secondService: Service) {
            return new Date(firstService.date).getTime() - new Date(secondService.date).getTime()
        })

        return <div className="series">
            <div className="headings">
                <div>{this.props.title}</div>
            </div>
            <div className="services">
                {services.map(service => {
                    return <ServiceView key={service.id} service={service} showSeries={false} showDate={true}></ServiceView>
                })}
            </div>
        </div>
    }
}
