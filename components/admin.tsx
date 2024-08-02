export interface AdminI {}

export function Admin({}: AdminI) {
  return (
    <div className="admin-access">
      <h2>Partner Access</h2>
      <p>
        Add or remove partners by address here. Once the tx is sent. They will
        be able to view the admin portal when they connect their wallet on RA1L.
      </p>

      <div className="admin-add">
        <input type="text" placeholder="Add an Address, ie: 0x1A4..." />
        <a className="button">Add</a>
      </div>

      <div className="pd-list">
        <div className="pd-item pd-header">
          <div className="pd-c">
            <input type="checkbox" />
          </div>
          <div className="pd-c">Partner Address</div>
          <div className="pd-c"></div>
        </div>
        {['LayerZero', 'Oasis', 'Vitalik Buterin', 'John Cena'].map(
          (item, index) => (
            <div className="pd-item" key={index}>
              <div className="pd-c">
                <input type="checkbox" />
              </div>
              <div className="pd-c">
                0xB5571Af1dC9e65a472796a2becdB43D8Bf5A4e38
              </div>
              <div className="pd-c">
                <a className="button">Remove</a>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Admin
