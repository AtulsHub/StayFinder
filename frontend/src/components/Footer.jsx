import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t pt-10 text-sm text-gray-600 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
          <div>
            <h5 className="font-semibold mb-2">Support</h5>
            <ul className="space-y-1">
              <li>Help Centre</li>
              <li>Safety information</li>
              <li>Cancellation options</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Community</h5>
            <ul className="space-y-1">
              <li>Diversity & Belonging</li>
              <li>Accessibility</li>
              <li>Invite friends</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Hosting</h5>
            <ul className="space-y-1">
              <li>Try Hosting</li>
              <li>AirCover for Hosts</li>
              <li>Explore hosting resources</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">About</h5>
            <ul className="space-y-1">
              <li>Newsroom</li>
              <li>Learn about our features</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
        <div className="bg-gray-200 py-2 text-center text-sm text-gray-600">
        <p>© 2025 StayFinder | Designed for Project Showcase</p>
      </div>
      </footer>
  )
}

export default Footer