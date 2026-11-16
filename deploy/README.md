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

Settings → Secrets and variables → Actions, the same values as in the
Tunispare app repositories:

| Kind | Name |
|---|---|
| Variable | `RELEASE_APP_CLIENT_ID` |
| Secret | `RELEASE_APP_PRIVATE_KEY` |
| Secret (optional) | `DISCORD_DEPLOY_WEBHOOK_URL` |

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
5. Commit and push: the Deploy workflow starts the pod.

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
