/**
 * frontend/src/components/Recorder/customRecords.js
 */


const simple = ({ event, data, time }) => {
  // console.log("simple emitted", data)

  const { action } = data
  const summary = action
    ? action
    : event

  return (
    <details
      key={time}
    >
      <summary>
        {summary}
      </summary>
      <pre>{JSON.stringify(data, null, 2)} </pre>
    </details>
  )
}


const open = ({ data, time }) => {
  // console.log("open emitted", data)
  const { url, generation } = data
  return (
    <details
      key={time}
    >
      <summary>
        {`open: ${url} (${generation})`}
      </summary>
      <pre>{JSON.stringify(data, null, 2).trim()}</pre>
    </details>
  )
}


const close = ({ data, time }) => {
  // console.log("close emitted", data)
  const { reason } = data
  return (
    <details
      key={time}
    >
      <summary>
        {`close: ${reason}`}
      </summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}


const incoming = ({ data, time }) => {
  // console.log("incoming emitted", data)
  const { subject, recipient_id } = data
  const socket_id = recipient_id
    ? recipient_id.slice(0,8)
    : ""
  const style = (socket_id) 
    ? { backgroundColor: "#906" }
    : {}

  return (
    <details
      key={time}
    >
      <summary
        style={style}
      >
        {`incoming: ${subject} ${socket_id}`}
      </summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

const pending = ({ data, time }) => {
  // console.log("pending emitted", data)
  let { corr, status, message } = data
  corr = corr.slice(0, 8)

  let style = {}
  switch (status) {
    case "queued":
      style = { backgroundColor: "#840" }
    break;
    case "sent":
      style = { backgroundColor: "#860" }
    break;
    case "acknowledged":
      style = { backgroundColor: "#880" }
    break;
    case "overdue ACK":
      style = { backgroundColor: "#c40" }
    break;
    case "handled":
      style = { backgroundColor: "#080" }
    break;
  }

  return (
    <details
      key={time}
    >
      <summary
        style={style}
      >
        {`pending: ${corr} ${status} ${message.subject}`}
      </summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

const state = ({ data, time }) => {
  // console.log("state emitted", data)
  const { from, to } = data
  return (
    <details
      key={time}
    >
      <summary>
        {`state: ${from} —> ${to}`}
      </summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

const logging = ({ data, time }) => {
  // console.log("state emitted", data)
  const { status, user_name, user_id } = data
  return (
    <details
      key={time}
    >
      <summary
        style = {{ backgroundColor: "#66c" }}
      >
        {`${status}: ${user_name} ${user_id.slice(0, 8)}`}
      </summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

const error = ({ data, time }) => {
  // console.log("error emitted", data)
  const { generation, current } = data
  if (typeof data === "object") {
    data = JSON.stringify(data, null, 2)
  }
  const status = generation === current ? "active" : "abandoned"
  const summary = `ERROR in gen ${generation} (${status})`
  return (
    <details
      key={time}
    >
      <summary
        style = {{ backgroundColor: "#900" }}
      >
        {summary}
      </summary>
      <pre>{data}</pre>
    </details>
  )
}

const warn = ({ data, time }) => {
  // console.log("warn emitted", data)
  let summary = ""
  let open = null

  if (typeof data === "string") {
    summary = data
    data = ""
    open = true
  } else if (data.message) {
    summary = `WARNING: ${data.message}`
    data = JSON.stringify(data, null, 2)
  }

  return (
    <details
      key={time}
      open={open}
    >
      <summary
        style = {{ backgroundColor: "#c60" }}
      >
        {summary}
      </summary>
        <pre>{data}</pre>
    </details>
  )
}


const info = ({ event, data, time }) => {
  // console.log("info emitted", data)
  let summary = ""
  let open = null
  let style = {}
  
  if (typeof data === "string") {
    summary = data
    open = true

    if (/^(\d+: )?ACK /.test(data)) {
      style = { backgroundColor: "#009" }
    }

    data = ""

  } else {
    const action = data.action
    if (action) { 
      if (action === "_openSocket") {
        summary = `_openSocket ${data.url}`
        style = { backgroundColor: "#909" }

      } else if (action === "_scheduleReconnect") {
        summary = `_scheduleReconnect ${data.reconnectMs}`
        style = { backgroundColor: "#609" }

      } else {
        summary = `${action} info`
      }
    }
    data = JSON.stringify(data, null, 2).trim()
  }

  return (
    <details
      key={time}
      open={open}
    >
      <summary
        style={style}
      >
        {summary}
      </summary>
      <pre>{data}</pre>
    </details>
  )
}


const alive = ({ event, data, time }) => {
  // console.log("simple emitted", data)

  return (
    <details
      key={time}
      open={true}
    >
      <summary>
        alive: {"" + data}
      </summary>
    </details>
  )
}


const exports = {
  simple,
  open,
  close,
  incoming,
  pending,
  state,
  logging,
  error,
  warn,
  info,
  alive
}

export default exports
