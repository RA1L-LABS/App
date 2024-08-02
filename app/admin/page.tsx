'use client'
import Admin from 'components/admin'

export interface AdminPageI {}

export default function AdminPage({}: AdminPageI) {
  return (
    <div className="container page">
      <Admin />
    </div>
  )
}
