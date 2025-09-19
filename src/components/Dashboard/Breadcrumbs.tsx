import {Breadcrumbs, BreadcrumbItem} from "@heroui/breadcrumbs";
import React from 'react'

const DashboardBreadcrumbs = () => {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Music</BreadcrumbItem>
      <BreadcrumbItem>Artist</BreadcrumbItem>
      <BreadcrumbItem>Album</BreadcrumbItem>
      <BreadcrumbItem>Song</BreadcrumbItem>
    </Breadcrumbs>
  )
}

export default DashboardBreadcrumbs