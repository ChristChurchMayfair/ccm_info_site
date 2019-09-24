import React, { Component } from 'react';
import { ContentfulClientApi, } from 'contentful';
import { ServiceView, ServiceFromContentfulItem } from './Service';
import "./Services.css"
import { ServiceFilter } from './ServicesFilterInput';
import { dateEndings, shortMonthNames } from './dateHelpers';
import { Service, Series } from './Types';
import { serviceTimeToServiceName } from './christchurchmayfair';

const seriesStyleClasses = ["one", "two", "three", "four", "five"]

type Props = {
    contentfulClient: ContentfulClientApi
    filters: ServiceFilter[]
    startDate: Date
    endDate: Date
    includeSeasonalServices?: boolean
    showPastServices: boolean
}

type State = {
    services: Service[]
}

export class Services extends Component<Props, State> {

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
                let services = response.items
                    .map(item => ServiceFromContentfulItem(item))
                    .filter(service => {
                        if (this.props.includeSeasonalServices !== undefined && this.props.includeSeasonalServices === true) {
                            return true
                        }
                        return  (service.series === undefined) || (service.series !== undefined && service.series.seasonal === undefined) || (service.series !== undefined && service.series.seasonal === false)
                    });
                this.setState({ services: services })
            }).catch(error => {
                console.log(error)
            })
    }

    onlyUnique(value: any, index: number, self: any[]) {
        return self.indexOf(value) === index;
    }

    drawDay(servicesByDay: { [date: string]: Service[] }, day: string, seriesClasses: {[seriesName: string]: string}) {
        if (day in servicesByDay) {
            return servicesByDay[day].map(service => {
                let serviceName = serviceTimeToServiceName[service.time]
                return <ServiceView key={service.id} service={service} showDate={false} serviceData={serviceName} showSeries={true} seriesClass={seriesClasses[service.series ? service.series.title : ""]}></ServiceView>
            })
        } else {
            return ""
        }
    }

    render() {

        const isSeries = (series: Series | undefined): series is Series => !!series

        let allSeries = this.state.services.map(service => service.series).filter(isSeries).filter(this.onlyUnique)

        var seriesNameToClassName = allSeries.reduce(function(prev: {[seriesName: string]: string}, current: Series, index: number){
            prev[current.title] = seriesStyleClasses[index]
            return prev
        }, {})

        let now = new Date()
        let servicesToDraw = this.state.services
            .filter(service => {
                if (this.props.showPastServices) {
                    return true
                } else {
                    return (new Date(service.date) > now)
                }
            })
            .filter(service => {
                return this.props.filters.map(filter => {
                    return filter.filter(service)
                }).reduce((previousValue: boolean, currentValue: boolean, idx, arr: boolean[]) => { return previousValue && currentValue }, true)
            })

        let dates = servicesToDraw.map(service => service.date).filter(this.onlyUnique)

        dates.sort(function (firstDateString: string, secondDateString: string) {
            let firstDate = new Date(firstDateString)
            let secondDate = new Date(secondDateString)
            return firstDate.getTime() - secondDate.getTime()
        })

        var servicesByDate: { [date: string]: Service[] } = {}

        servicesToDraw.forEach((service: Service) => {
            if (servicesByDate[service.date] === undefined) {
                servicesByDate[service.date] = []
            }
            servicesByDate[service.date].push(service)
        })

        return <div className="normalServices">
            <div className="servicesHeadings">
                <div></div>
                <div className="heading">Sunday 10:15</div>
                <div className="heading">Sunday 18:00</div>
            </div>
            <div className="services">
                {dates.map(day => {

                    var dayObj = new Date(day)

                    var formattedDate = "" + dayObj.getDate() + dateEndings[dayObj.getDate() - 1] + " " + shortMonthNames[dayObj.getUTCMonth()]

                    return <div key={day} className="day">
                        <div className="date">{formattedDate}</div>
                        {this.drawDay(servicesByDate, day, seriesNameToClassName)}
                    </div>
                })}
            </div>
        </div>
    }
}
