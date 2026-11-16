# Putting the portfolio on the VPS (k3s), like the Tunispare apps

How it flows once set up, the same as the three apps:

```
git push (main)  →  CI: check → security → image (ghcr.io/moanesbbr/potfoliov2:<sha>)
                 →  release: writes <sha> into Tunispare/tunispare-deploy k3s/kustomization.yaml
                 →  tunispare-deploy's Deploy workflow applies it on the server
```

## One-time setup

### 1. Push this repository

```bash
git add -A
git commit -m "Portfolio: first version"
git branch -M main
git push -u origin main
```

Actions → **Portfolio** runs. The first time, the release job stops with a
notice: the portfolio is not in tunispare-deploy yet. Note the short SHA of
the image it built (the 7 first characters of the commit, also shown in the
notice).

### 2. Make the image public

GitHub → your profile → **Packages** → `potfoliov2` → Package settings →
Change visibility → **Public**. The site's content is public anyway, and the
cluster then pulls the image without a credential.

### 3. Give this repository the release credentials

The release key can change any production manifest in tunispare-deploy, so
only `main` may use it:

1. Settings → Branches: protect `main` (no force push, no deletion).
2. Settings → Environments → **New environment** `production` →
   Deployment branches and tags: **Selected branches** → add `main`.
3. In that environment (not in the repository's secrets), the same values as
   in the Tunispare app repositories:

| Kind | Name |
|---|---|
| Environment variable | `RELEASE_APP_CLIENT_ID` |
| Environment secret | `RELEASE_APP_PRIVATE_KEY` |

4. Delete `RELEASE_APP_PRIVATE_KEY` (and the variable) from Settings →
   Secrets and variables → Actions if they were put there first: a
   repository secret can be read by a workflow edited on any branch.

`DISCORD_DEPLOY_WEBHOOK_URL` (optional) stays a repository secret: the failure
notice runs on every branch.

### 4. Add the portfolio to tunispare-deploy (one commit)

In `tunispare-deploy`:

1. Copy `deploy/portfolio.yaml` to `k3s/apps/portfolio.yaml`.
2. In `k3s/kustomization.yaml`, add under `resources:`

   ```yaml
     - apps/portfolio.yaml
   ```

   and under `images:` (with the SHA from step 1, quoted)

   ```yaml
     - name: ghcr.io/moanesbbr/potfoliov2
       newTag: "abc1234"
   ```
3. In `.github/workflows/deploy.yml`, step « Wait for every app to be healthy »,
   add the portfolio to the list so a bad release is rolled back like the others:

   ```bash
   apps=(tunispare/backend tunispare/website tunispare/backoffice tunispare/portfolio)
   ```
4. Append `deploy/ingress-portfolio.yaml` to `k3s/ingress/ingress.yaml` (after a `---` line).
5. In `k3s/monitoring/config/prometheus.yml`, job `probe-public`, add
   `https://moanesbbr.tunispare.com/` to the targets: the `SiteDown` alert
   and the certificate-expiry alerts then cover it.
6. Commit and push: the Deploy workflow starts the pod.

`portfolio.yaml` ends with a NetworkPolicy, `portfolio-isolated`: MySQL and
the AI reader trust every pod of the `tunispare` namespace, so the portfolio
is fenced off. It accepts Traefik only (namespace `kube-system`, port 8080)
and opens no connection. Check it once deployed: the site answers, and from
inside the pod nothing does:

```bash
curl -sI https://moanesbbr.tunispare.com | head -1                       # HTTP/1.1 200 OK
sudo k3s kubectl -n tunispare exec deploy/portfolio --   wget -q -T 3 -O /dev/null http://backend:3001/health; echo $?          # not 0: blocked
```

### 5. DNS and certificate

The A record `moanesbbr.tunispare.com → 54.37.9.74` is in place. Apply the
routing once, on the server, as for the other sites:

```bash
sudo k3s kubectl apply -k ~/k3s/ingress
sudo k3s kubectl -n tunispare get certificate portfolio-tls   # READY True after a minute
```

### 6. Check

```bash
curl -sI https://moanesbbr.tunispare.com | grep -iE 'HTTP|content-security|cache-control'
curl -s https://moanesbbr.tunispare.com/robots.txt
```

Then add the site in Google Search Console and Bing Webmaster Tools and submit
`https://moanesbbr.tunispare.com/sitemap.xml`.

## After that

Every push to `main` goes to production by itself. Roll back by putting the
previous SHA back in `k3s/kustomization.yaml` (one line), as for the apps.

## Changing the address later

Set the repository variable `PUBLIC_SITE_URL` (and `VITE_SITE_URL` in `.env`
for local builds), change the host in the Ingress, add the DNS record, push.
